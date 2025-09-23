import React from 'react'
import { Badge } from './ui/badge';
import { FilterType } from '@/lib/data';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

const StatsAndFilters = ({completedTasksCount = 0, activedTasksCount = 0, filter = "all", setFilter}) => {
  return (
    <div className='flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center'>
      {/* Thống kê */}
      <div className='flex gap-3'>
        <Badge
          variant="secoundary"
          className="bg-white/50 text-accent-foreground border-info/20"
        >
          {activedTasksCount} {FilterType.active}
        </Badge>
        <Badge
          variant="secoundary"
          className="bg-white/50 text-success border-success/20"
        >
          {completedTasksCount} {FilterType.completed}
        </Badge>
      </div>
      {/* Filter */}
      <div className='flex flex-col gap-2 sm:flex-row'>
        {Object.keys(FilterType).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size="sm"
            className="capitalize cursor-pointer"
            onClick={() => setFilter(type)}
          >
            <Filter className='size-4'/> {FilterType[type]}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default StatsAndFilters;