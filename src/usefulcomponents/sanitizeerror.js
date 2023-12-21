
// errorHandler.js

export const handleGlobalErrors = () => {
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      // Perform cleanup or necessary actions before exiting (if needed)
      process.exit(1); // Terminate the process (optional)
    });
  
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection:', reason);
      // Handle unhandled promise rejections here
    });
  };
  
  
  export default handleGlobalErrors;