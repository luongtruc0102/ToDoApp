import React, { useEffect, useState } from 'react'

const Header = () => {
  const [username, setUsername] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if(storedUser){
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    }
  }, []);

  return (
    <div className='space-y-2 text-center'>
      <h1 className='text-4xl font-bold text-transparent bg-primary bg-clip-text'>
        Hello {username && <span>{username}</span>} 
      </h1>

      <p className='text-muted-foreground'>
        Không có việc gì khó, chỉ sợ mình không làm
      </p>
    </div>
  )
}

export default Header;