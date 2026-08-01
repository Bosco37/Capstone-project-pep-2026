import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Something went wrong!</h1>
          <p className="text-xl text-gray-800 mb-6">The application crashed. Here are the details:</p>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-auto text-left border border-red-200">
            <h2 className="text-lg font-bold text-red-800 mb-2">{this.state.error && this.state.error.toString()}</h2>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.href = '/'} 
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
          >
            Return to Home Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
