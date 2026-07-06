import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SystemTourModal from './SystemTourModal';

describe('SystemTourModal', () => {
 const defaultProps = {
 isOpen: true,
 onClose: jest.fn(),
 title: 'Welcome to System Tour',
 description: 'This is a test description for the system tour modal.',
 };

 beforeEach(() => {
 jest.clearAllMocks();
 });

 describe('Rendering', () => {
 it('should not render when isOpen is false', () => {
 render(
 <SystemTourModal {...defaultProps} isOpen={false} />
 );
 expect(screen.queryByTestId('system-tour-modal-overlay')).not.toBeInTheDocument();
 });

 it('should render when isOpen is true', () => {
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByTestId('system-tour-modal-content')).toBeInTheDocument();
 });

 it('should display the title', () => {
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByTestId('system-tour-modal-title')).toHaveTextContent(
 'Welcome to System Tour'
 );
 });
 });

 describe('Typewriter Effect', () => {
 it('should start typewriter effect when modal opens', async () => {
 const description = 'Test description';
 render(
 <SystemTourModal
 {...defaultProps}
 description={description}
 />
 );

 const textElement = screen.getByTestId('system-tour-modal-text');

 await waitFor(
 () => {
 expect(textElement.textContent).toContain(description);
 },
 { timeout: 3000 }
 );
 });

 it('should display text character by character', async () => {
 const description = 'Hello World';
 render(
 <SystemTourModal
 {...defaultProps}
 description={description}
 />
 );

 const textElement = screen.getByTestId('system-tour-modal-text');

 await waitFor(
 () => {
 expect(textElement.textContent).toContain('H');
 },
 { timeout: 200 }
 );

 await waitFor(
 () => {
 expect(textElement.textContent).toContain('Hello');
 },
 { timeout: 500 }
 );
 });

 it('should show cursor while typing', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 description="Test"
 />
 );

 const cursor = screen.getByTestId('system-tour-modal-text').querySelector(
 '.tour-typewriter-cursor'
 );
 expect(cursor).toBeInTheDocument();
 });

 it('should complete typing and remove cursor', async () => {
 const description = 'Test';
 render(
 <SystemTourModal
 {...defaultProps}
 description={description}
 />
 );

 await waitFor(
 () => {
 expect(screen.getByTestId('system-tour-modal-text')).toHaveTextContent(
 description
 );
 },
 { timeout: 2000 }
 );
 });

 it('should reset typewriter on description change', async () => {
 const { rerender } = render(
 <SystemTourModal
 {...defaultProps}
 description="First description"
 />
 );

 await waitFor(() => {
 expect(screen.getByTestId('system-tour-modal-text')).toHaveTextContent(
 'First'
 );
 });

 rerender(
 <SystemTourModal
 {...defaultProps}
 description="Second description"
 />
 );

 await waitFor(() => {
 expect(screen.getByTestId('system-tour-modal-text')).toHaveTextContent(
 'Second'
 );
 });
 });
 });

 describe('Step Navigation', () => {
 it('should display step counter when totalSteps > 1', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={2}
 totalSteps={5}
 />
 );
 expect(screen.getByTestId('system-tour-modal-step-counter')).toHaveTextContent(
 'Step 2 of 5'
 );
 });

 it('should not display step counter when totalSteps is 1', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={1}
 />
 );
 expect(screen.queryByTestId('system-tour-modal-step-counter')).not.toBeInTheDocument();
 });

 it('should show Previous button when currentStep > 1', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={2}
 totalSteps={5}
 onPrev={jest.fn()}
 />
 );
 expect(screen.getByTestId('system-tour-modal-prev-btn')).toBeInTheDocument();
 });

 it('should hide Previous button when currentStep is 1', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={5}
 onPrev={jest.fn()}
 />
 );
 expect(screen.queryByTestId('system-tour-modal-prev-btn')).not.toBeInTheDocument();
 });

 it('should show Next button when currentStep < totalSteps', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={5}
 onNext={jest.fn()}
 />
 );
 expect(screen.getByTestId('system-tour-modal-next-btn')).toBeInTheDocument();
 });

 it('should show Complete Tour button on last step', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={5}
 totalSteps={5}
 onClose={jest.fn()}
 />
 );
 expect(screen.getByTestId('system-tour-modal-complete-btn')).toBeInTheDocument();
 });

 it('should call onNext when Next button is clicked', async () => {
 const onNext = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={5}
 onNext={onNext}
 />
 );
 await userEvent.click(screen.getByTestId('system-tour-modal-next-btn'));
 expect(onNext).toHaveBeenCalled();
 });

 it('should call onPrev when Previous button is clicked', async () => {
 const onPrev = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={2}
 totalSteps={5}
 onPrev={onPrev}
 />
 );
 await userEvent.click(screen.getByTestId('system-tour-modal-prev-btn'));
 expect(onPrev).toHaveBeenCalled();
 });
 });

 describe('User Interactions', () => {
 it('should call onClose when close button is clicked', async () => {
 const onClose = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 onClose={onClose}
 />
 );
 await userEvent.click(screen.getByTestId('system-tour-modal-close-btn'));
 expect(onClose).toHaveBeenCalled();
 });

 it('should call onSkip when skip button is clicked', async () => {
 const onSkip = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 onSkip={onSkip}
 />
 );
 await userEvent.click(screen.getByTestId('system-tour-modal-skip-btn'));
 expect(onSkip).toHaveBeenCalled();
 });

 it('should call onClose when close button is clicked on last step', async () => {
 const onClose = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={5}
 totalSteps={5}
 onClose={onClose}
 />
 );
 await userEvent.click(screen.getByTestId('system-tour-modal-complete-btn'));
 expect(onClose).toHaveBeenCalled();
 });

 it('should close on ESC key press', () => {
 const onClose = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 onClose={onClose}
 />
 );
 fireEvent.keyDown(document, { key: 'Escape' });
 expect(onClose).toHaveBeenCalled();
 });

 it('should close when clicking overlay background', async () => {
 const onClose = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 onClose={onClose}
 />
 );
 const overlay = screen.getByTestId('system-tour-modal-overlay');
 await userEvent.click(overlay);
 expect(onClose).toHaveBeenCalled();
 });
 });

 describe('Progress Bar', () => {
 it('should display progress bar when totalSteps > 1', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={2}
 totalSteps={5}
 />
 );
 expect(screen.getByTestId('system-tour-modal-progress-bar')).toBeInTheDocument();
 expect(screen.getByTestId('system-tour-modal-progress-fill')).toBeInTheDocument();
 });

 it('should calculate correct progress percentage', () => {
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={3}
 totalSteps={5}
 />
 );
 const progressFill = screen.getByTestId('system-tour-modal-progress-fill');
 expect(progressFill).toHaveStyle({ width: '60%' });
 });

 it('should update progress on step change', () => {
 const { rerender } = render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={5}
 />
 );
 let progressFill = screen.getByTestId('system-tour-modal-progress-fill');
 expect(progressFill).toHaveStyle({ width: '20%' });

 rerender(
 <SystemTourModal
 {...defaultProps}
 currentStep={4}
 totalSteps={5}
 />
 );
 progressFill = screen.getByTestId('system-tour-modal-progress-fill');
 expect(progressFill).toHaveStyle({ width: '80%' });
 });
 });

 describe('Responsive Design', () => {
 it('should render on mobile viewport', () => {
 global.innerWidth = 375;
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByTestId('system-tour-modal-content')).toBeInTheDocument();
 });

 it('should render on tablet viewport', () => {
 global.innerWidth = 768;
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByTestId('system-tour-modal-content')).toBeInTheDocument();
 });

 it('should render on desktop viewport', () => {
 global.innerWidth = 1920;
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByTestId('system-tour-modal-content')).toBeInTheDocument();
 });
 });

 describe('Accessibility', () => {
 it('should have proper ARIA labels', () => {
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByLabelText('Close tour')).toBeInTheDocument();
 });

 it('should be keyboard accessible', async () => {
 const onNext = jest.fn();
 render(
 <SystemTourModal
 {...defaultProps}
 currentStep={1}
 totalSteps={5}
 onNext={onNext}
 />
 );
 const nextButton = screen.getByTestId('system-tour-modal-next-btn');
 nextButton.focus();
 await userEvent.keyboard('{Enter}');
 expect(onNext).toHaveBeenCalled();
 });
 });

 describe('Drag Functionality', () => {
 beforeEach(() => {
 // Mock window dimensions
 Object.defineProperty(window, 'innerWidth', { value: 1200 });
 Object.defineProperty(window, 'innerHeight', { value: 800 });
 });

 it('should show drag handle in header', () => {
 render(<SystemTourModal {...defaultProps} />);
 expect(screen.getByText('Drag to move')).toBeInTheDocument();
 });

 it('should have grab cursor on header', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');
 expect(header).toHaveClass('cursor-grab');
 });

 it('should start dragging on mouse down', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

 // The modal should have grabbing cursor during drag
 expect(header).toHaveClass('active:cursor-grabbing');
 });

 it('should update position during drag', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');
 const modal = screen.getByTestId('system-tour-modal-content');

 // Start drag
 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

 // Move mouse
 fireEvent.mouseMove(document, { clientX: 200, clientY: 150 });

 // Modal should have new position
 expect(modal).toHaveStyle({ left: '100px', top: '50px' });
 });

 it('should stop dragging on mouse up', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 // Start and stop drag
 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
 fireEvent.mouseUp(document);

 // Should reset cursor
 expect(document.body.style.cursor).toBe('');
 });

 it('should constrain modal within viewport bounds', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 // Try to drag outside viewport bounds
 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
 fireEvent.mouseMove(document, { clientX: 1500, clientY: 1000 }); // Outside bounds

 const modal = screen.getByTestId('system-tour-modal-content');
 // Should be constrained to viewport
 expect(modal).toHaveStyle({
 left: expect.stringMatching(/^\d+px$/),
 top: expect.stringMatching(/^\d+px$/)
 });
 });

 it('should reset position when modal reopens', () => {
 const { rerender } = render(<SystemTourModal {...defaultProps} isOpen={false} />);

 // Open modal
 rerender(<SystemTourModal {...defaultProps} isOpen={true} />);

 const modal = screen.getByTestId('system-tour-modal-content');
 // Should be centered initially
 expect(modal).toHaveStyle({
 left: '50%',
 top: '50%',
 transform: 'translate(-50%, -50%)'
 });
 });

 it('should handle touch events for mobile', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 // Start touch drag
 fireEvent.touchStart(header, {
 touches: [{ clientX: 100, clientY: 100 }]
 });

 // Move touch
 fireEvent.touchMove(document, {
 touches: [{ clientX: 200, clientY: 150 }]
 });

 const modal = screen.getByTestId('system-tour-modal-content');
 expect(modal).toHaveStyle({ left: '100px', top: '50px' });

 // End touch
 fireEvent.touchEnd(document);
 });

 it('should prevent text selection during drag', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });

 expect(document.body.style.userSelect).toBe('none');
 });

 it('should restore text selection after drag ends', () => {
 render(<SystemTourModal {...defaultProps} />);
 const header = screen.getByTestId('system-tour-modal-header');

 fireEvent.mouseDown(header, { clientX: 100, clientY: 100 });
 fireEvent.mouseUp(document);

 expect(document.body.style.userSelect).toBe('');
 });
 });
});
