import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            
            <p className="text-lg text-gray-200 mb-6">
              We're experiencing technical difficulties. Please try refreshing the page.
            </p>
            
            <div className="card-gradient p-6 rounded-lg shadow-primary-lg border border-primary-200/20 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">What happened?</h2>
              <p className="text-gray-600 mb-3">
                The application encountered an unexpected error.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Details:</h3>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-800 text-left overflow-x-auto">
                    {this.state.error && this.state.error.message}
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-secondary text-white px-6 py-3 rounded-lg hover:bg-gradient-accent transition-all duration-200 shadow-primary hover:shadow-primary-lg transform hover:-translate-y-1 mr-3"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200"
              >
                Go to Home
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-300">
              <p>If this problem persists, please contact support.</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;