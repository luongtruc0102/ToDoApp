import React from 'react'

const Footer = ({completedTasksCount = 0, activedTasksCount = 0}) => {
  return (
    <>
      {completedTasksCount + activedTasksCount > 0 && (
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            {completedTasksCount > 0 && (
              <>
                🎉 Tuyệt vời! Bạn đã hoàn thành {completedTasksCount} việc rồi
                {activedTasksCount > 0 && 
                  `, còn ${activedTasksCount} việc nữa thôi. Cố lên 🥳.`}
              </>
            )}
            
            {completedTasksCount === 0 && (
              <>Hãy bắt đầu làm {activedTasksCount} công việc nào!</>
            )}
          </p>
        </div>
      )}
    </>
  )
}

export default Footer