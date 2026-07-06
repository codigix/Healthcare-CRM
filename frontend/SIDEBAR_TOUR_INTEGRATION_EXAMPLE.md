# Sidebar Tour Integration Example

## Overview

This document demonstrates how to integrate the SidebarTour component into your Healthcare CRM application. The SidebarTour provides an interactive guided tour of all sidebar navigation modules with upward-pointing popups, dashboard connections, smooth animations, and detailed explanations.

## Basic Integration

### 1. Import the Component

```tsx
import SidebarTour from '@/components/SidebarTour';
```

### 2. Add to Your Layout

The SidebarTour is already integrated into the Topbar component (`frontend/src/components/Layout/Topbar.tsx`):

```tsx
import SidebarTour from '@/components/SidebarTour';

// In your component JSX
<div className="flex items-center gap-4">
  <SidebarTour />
  {/* other topbar elements */}
</div>
```

## Component API

### Props

```tsx
interface SidebarTourProps {
  onComplete?: () => void;    // Callback when tour completes
  autoStart?: boolean;        // Auto-start tour on mount
}
```

### Usage Examples

#### Basic Usage
```tsx
<SidebarTour />
```

#### With Completion Callback
```tsx
<SidebarTour
  onComplete={() => {
    console.log('Sidebar tour completed!');
    // Track analytics, show success message, etc.
  }}
/>
```

#### Auto-start Tour
```tsx
<SidebarTour autoStart={true} />
```

## Tour Steps Configuration

The tour steps are defined in the `sidebarTourSteps` array within `SidebarTour.tsx`:

```tsx
const sidebarTourSteps: SidebarTourStep[] = [
  {
    title: '🏥 Dashboard Module',
    description: 'Central command center with key metrics...',
    targetSelector: '[data-tour="dashboard-nav"]',
    position: 'right',
  },
  // ... 22 more steps
];
```

### Step Properties

```tsx
interface SidebarTourStep {
  title: string;              // Step title with emoji
  description: string;        // Detailed explanation
  targetSelector?: string;    // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right'; // Modal position
}
```

## Data Attributes for Targeting

The sidebar navigation items use specific data attributes for tour targeting:

```tsx
// In Sidebar.tsx
<button
  data-tour="dashboard-nav"
  // ...
>
  Dashboard
</button>

<button
  data-tour="doctors-nav"
  // ...
>
  Doctors
</button>

// ... etc for all navigation items
```

## Customization Examples

### Adding a New Tour Step

```tsx
// In SidebarTour.tsx
const sidebarTourSteps: SidebarTourStep[] = [
  // ... existing steps
  {
    title: '🎯 New Custom Module',
    description: 'This is a new feature we added to the system. It allows users to...',
    targetSelector: '[data-tour="custom-module-nav"]',
    position: 'right',
  },
];
```

### Modifying Step Content

```tsx
{
  title: '🏥 Updated Dashboard Module',
  description: `
    Welcome to your enhanced Dashboard!

    New features include:
    • Advanced analytics
    • Real-time notifications
    • Customizable widgets

    Click to explore all dashboard views.
  `,
  targetSelector: '[data-tour="dashboard-nav"]',
  position: 'right',
}
```

### Changing Highlight Styling

```tsx
// In SidebarTour.tsx, highlightElement function
const highlightElement = (stepIndex: number) => {
  // Remove previous highlight
  if (highlightedElement) {
    highlightedElement.style.boxShadow = '';
    highlightedElement.style.borderRadius = '';
  }

  const step = sidebarTourSteps[stepIndex];
  if (step.targetSelector) {
    const element = document.querySelector(step.targetSelector) as HTMLElement;
    if (element) {
      // Custom highlight styling
      element.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.6), 0 0 15px rgba(34, 197, 94, 0.4)';
      element.style.borderRadius = '6px';
      element.style.transition = 'all 0.3s ease';

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedElement(element);
    }
  }
};
```

## Integration with User Roles

### Role-Based Tour Content

```tsx
// Conditional tour steps based on user role
const getTourSteps = (userRole: string) => {
  const baseSteps = [
    // Common steps for all users
  ];

  if (userRole === 'admin') {
    return [
      ...baseSteps,
      // Admin-specific steps
      {
        title: '⚙️ Admin Settings',
        description: 'Access advanced system configuration...',
        targetSelector: '[data-tour="admin-settings-nav"]',
      }
    ];
  }

  if (userRole === 'doctor') {
    return [
      ...baseSteps,
      // Doctor-specific steps
      {
        title: '📋 Patient Records',
        description: 'Access your patient medical records...',
        targetSelector: '[data-tour="patient-records-nav"]',
      }
    ];
  }

  return baseSteps;
};
```

### Dynamic Tour Start

```tsx
// Auto-start tour for new users
useEffect(() => {
  const isNewUser = localStorage.getItem('hasSeenSidebarTour') !== 'true';

  if (isNewUser && userRole) {
    // Start tour after a brief delay
    setTimeout(() => {
      setAutoStartTour(true);
      localStorage.setItem('hasSeenSidebarTour', 'true');
    }, 2000);
  }
}, [userRole]);
```

## Event Handling

### Tour Completion Tracking

```tsx
const handleTourComplete = () => {
  // Track completion in analytics
  analytics.track('sidebar_tour_completed', {
    userId: currentUser.id,
    timestamp: new Date().toISOString(),
    totalSteps: 23
  });

  // Update user preferences
  updateUserPreferences({
    hasCompletedSidebarTour: true,
    lastTourCompletion: new Date()
  });

  // Show success message
  toast.success('🎉 Welcome to your Healthcare CRM!', {
    description: 'You\'ve completed the sidebar tour. Explore all the modules to get started.'
  });
};

<SidebarTour onComplete={handleTourComplete} />
```

### Step-by-Step Progress Tracking

```tsx
const [currentStep, setCurrentStep] = useState(0);

const handleStepChange = (step: number) => {
  setCurrentStep(step);

  // Track individual step completion
  analytics.track('sidebar_tour_step_viewed', {
    stepNumber: step + 1,
    stepTitle: sidebarTourSteps[step].title,
    userId: currentUser.id
  });
};

// Pass to SidebarTour (would need to modify component to support)
<SidebarTour onStepChange={handleStepChange} />
```

## Styling Customization

### Custom Button Styling

```tsx
// Custom tour button component
const CustomSidebarTour = () => {
  return (
    <button
      onClick={handleStartTour}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      data-testid="custom-sidebar-tour-start-button"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <span className="font-semibold">Explore Features</span>
    </button>
  );
};
```

### Modal Customization

```tsx
// Custom modal styling (would need to modify SystemTourModal)
const customModalStyles = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)', // slate-900 with opacity
  border: '1px solid rgba(51, 65, 85, 0.5)', // slate-700
  borderRadius: '12px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
};
```

## Error Handling

### Graceful Degradation

```tsx
const handleTourError = (error: Error) => {
  console.error('Sidebar tour error:', error);

  // Fallback for missing elements
  if (error.message.includes('element not found')) {
    toast.warning('Some tour elements may not be available on this page');
  }
};

<SidebarTour onError={handleTourError} />
```

### Network-dependent Content

```tsx
// Handle dynamic content loading
const handleTourStart = async () => {
  try {
    // Ensure sidebar is loaded
    await waitForElement('[data-tour="sidebar"]');

    // Check if all tour elements exist
    const missingElements = sidebarTourSteps
      .map(step => step.targetSelector)
      .filter(selector => selector && !document.querySelector(selector));

    if (missingElements.length > 0) {
      console.warn('Missing tour elements:', missingElements);
    }

    setShowModal(true);
  } catch (error) {
    toast.error('Unable to start tour. Please refresh the page.');
  }
};
```

## Performance Optimization

### Lazy Loading

```tsx
const SidebarTour = lazy(() => import('@/components/SidebarTour'));

// In your component
<Suspense fallback={<div>Loading tour...</div>}>
  <SidebarTour />
</Suspense>
```

### Conditional Rendering

```tsx
// Only show tour for authenticated users
{isAuthenticated && <SidebarTour />}

// Only show for specific routes
{pathname !== '/login' && <SidebarTour />}
```

## Testing Integration

### Unit Tests

```tsx
// SidebarTour.test.tsx
describe('SidebarTour Integration', () => {
  it('integrates with Topbar component', () => {
    render(<Topbar />);
    expect(screen.getByTestId('sidebar-tour-start-button')).toBeInTheDocument();
  });

  it('highlights correct sidebar elements', async () => {
    render(<AppWithSidebar />);
    const tourButton = screen.getByTestId('sidebar-tour-start-button');

    fireEvent.click(tourButton);

    await waitFor(() => {
      const highlightedElement = document.querySelector('[data-tour="dashboard-nav"]');
      expect(highlightedElement).toHaveStyle({
        boxShadow: expect.stringContaining('rgba(59, 130, 246')
      });
    });
  });
});
```

### E2E Tests

```tsx
// e2e/sidebar-tour.spec.ts
test('complete sidebar tour walkthrough', async ({ page }) => {
  await page.goto('/dashboard');

  // Start tour
  await page.click('[data-testid="sidebar-tour-start-button"]');

  // Verify first step
  await expect(page.locator('[data-testid="modal-title"]')).toContainText('Dashboard Module');

  // Complete tour
  for (let i = 0; i < 22; i++) {
    await page.click('[data-testid="modal-next"]');
  }

  // Verify completion
  await expect(page.locator('[data-testid="modal-title"]')).toContainText('Sidebar Tour Complete');
});
```

## Accessibility Considerations

### ARIA Labels

```tsx
<button
  onClick={handleStartTour}
  aria-label="Start interactive sidebar tour to learn about all CRM modules"
  data-testid="sidebar-tour-start-button"
>
  <svg aria-hidden="true" className="w-5 h-5">
    {/* icon */}
  </svg>
  <span>Sidebar Tour</span>
</button>
```

### Keyboard Navigation

```tsx
// Enhanced keyboard support
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!showModal) return;

    switch (event.key) {
      case 'Escape':
        handleCloseTour();
        break;
      case 'ArrowRight':
        handleNextStep();
        break;
      case 'ArrowLeft':
        handlePrevStep();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [showModal]);
```

## Deployment Checklist

- [ ] Component builds successfully
- [ ] All TypeScript types are correct
- [ ] Tests pass (when testing is set up)
- [ ] Data attributes are present on sidebar elements
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility features are functional
- [ ] Documentation is up to date
- [ ] Performance is optimized

## Troubleshooting

### Common Issues

1. **Tour button not visible**
   - Check if SidebarTour is imported in Topbar
   - Verify component is rendered in JSX

2. **Elements not highlighting**
   - Ensure data-tour attributes are on sidebar elements
   - Check CSS selector syntax
   - Verify elements exist in DOM

3. **Modal not appearing**
   - Check SystemTourModal import
   - Verify modal state management
   - Check for JavaScript errors

4. **Typewriter effect not working**
   - Verify SystemTourModal component is correctly implemented
   - Check typing speed configuration

### Debug Mode

```tsx
// Enable debug logging
const DEBUG_TOUR = process.env.NODE_ENV === 'development';

const debugLog = (message: string, data?: any) => {
  if (DEBUG_TOUR) {
    console.log(`[SidebarTour] ${message}`, data);
  }
};
```

This integration example provides comprehensive guidance for implementing and customizing the SidebarTour component in your Healthcare CRM application.