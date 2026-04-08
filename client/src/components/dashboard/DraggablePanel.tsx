import React, { useState, ReactNode } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { GripVertical, Trash2, Settings } from 'lucide-react'
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface DraggableItem {
  id: string
  content: ReactNode
  title: string
}

interface DraggablePanelProps {
  items: DraggableItem[]
  isCustomizing: boolean
  onReorder?: (newOrder: DraggableItem[]) => void
  onDelete?: (itemId: string) => void
  onConfigure?: (itemId: string) => void
  className?: string
}

interface SortableItemProps {
  item: DraggableItem
  isCustomizing: boolean
  onDelete?: (itemId: string) => void
  onConfigure?: (itemId: string) => void
}

function SortableItem({ item, isCustomizing, onDelete, onConfigure }: SortableItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group mb-4 ${isDragging ? 'opacity-50 z-50' : 'z-10'} ring-2 ring-cyan-500/10 hover:ring-cyan-500/30 rounded-lg transition-all duration-200`}
    >
      {/* Drag Handle and Controls Overlay - Always visible */}
      <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 rounded-lg p-1 backdrop-blur-sm border border-slate-700/50">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-400 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
        {onConfigure && (
          <button
            onClick={() => onConfigure(item.id)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
            title="Configure"
          >
            <Settings size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Item Content */}
      <div>
        {item.content}
      </div>

      {/* Widget Title Overlay */}
      <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-mono bg-slate-900/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {item.title}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete?.(item.id);
          setShowDeleteConfirm(false);
        }}
        title="Remove Chart"
        message={`Are you sure you want to remove "${item.title}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Keep"
        variant="danger"
      />
    </div>
  )
}

export function DraggablePanel({ 
  items, 
  isCustomizing, 
  onReorder, 
  onDelete, 
  onConfigure,
  className = "" 
}: DraggablePanelProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [currentItems, setCurrentItems] = useState(items)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = currentItems.findIndex((item) => item.id === active.id)
      const newIndex = currentItems.findIndex((item) => item.id === over?.id)
      
      const newOrder = arrayMove(currentItems, oldIndex, newIndex)
      setCurrentItems(newOrder)
      
      // Save the new order immediately to localStorage
      if (onReorder) {
        onReorder(newOrder)
        console.log('🔒 SAVED: Panel item positions updated and persisted')
      }
    }

    setActiveId(null)
  }

  const handleDelete = (itemId: string) => {
    const updatedItems = currentItems.filter(item => item.id !== itemId)
    setCurrentItems(updatedItems)
    
    // Save deletion immediately to localStorage
    if (onDelete) {
      onDelete(itemId)
      console.log('🗑️ DELETED: Panel item removed and persisted')
    }
  }

  // Update items when props change
  React.useEffect(() => {
    setCurrentItems(items)
  }, [items])

  // Always render with drag functionality

  return (
    <div className={className}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext 
          items={currentItems.map(item => item.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {currentItems.map((item) => (
              <div key={item.id} className="relative z-10 mb-4">
                <SortableItem
                  item={item}
                  isCustomizing={isCustomizing}
                  onDelete={handleDelete}
                  onConfigure={onConfigure}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-90 transform rotate-2 scale-105">
              {currentItems.find(item => item.id === activeId)?.content}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}