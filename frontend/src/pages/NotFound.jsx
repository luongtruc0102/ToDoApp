import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50"> 
            <img 
            src="404_NotFound.png" 
            alt="Not Found" 
            className="max-w-full mb-6 w-96" 
            />

            <p className="text-xl font-simebold">
                Trang không tồn tại
            </p>

            <a href="/" className="inline-block mt-6 px-6 py-3 rounded-2xl bg-primary text-white transition shadow-md font-medium hover:bg-primary-dark">
                Quay về trang chủ
            </a>
        </div>
    );
};

export default NotFound;