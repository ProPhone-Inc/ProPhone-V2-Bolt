import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthContainer } from './components/AuthContainer';
import { useCallState } from './hooks/useCallState'; 
import { useIncomingCalls } from './hooks/useIncomingCalls';
import { PhoneCallModal } from './components/Phone/components/PhoneCallModal';

const Dashboard = lazy(() => 
  import('./components/Dashboard/Dashboard').then(module => ({ default: module.Dashboard }))
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeCall } = useCallState();
  const { incomingCall } = useIncomingCalls();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <ErrorBoundary>
      {/* Global Call Modal */}
      {activeCall && (
        <PhoneCallModal
          onClose={() => useCallState.getState().setActiveCall(null)}
          contactName={activeCall.name}
          contactNumber={activeCall.number}
          isFloating={true}
        />
      )}
      {/* Incoming Call Modal */}
      {incomingCall && (
        <PhoneCallModal
          onClose={() => useIncomingCalls.getState().setIncomingCall(null)}
          contactName={incomingCall.name}
          contactNumber={incomingCall.number}
          isFloating={false}
          isIncoming={true}
        />
      )}

      {isAuthenticated ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      ) : (
        <AuthContainer />
      )}
    </ErrorBoundary>
  );
}

export default App;