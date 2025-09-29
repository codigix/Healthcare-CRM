import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { chatWithAI, addChatMessage, clearChatHistory, generateReport } from '../../slices/reportsSlice';
import { fetchPatients } from '../../slices/patientsSlice';
import { fetchDoctors } from '../../slices/doctorsSlice';
import { fetchDepartments } from '../../slices/departmentsSlice';

const AIAssistant = () => {
  const dispatch = useDispatch();
  const { aiChatHistory, isLoading, isGeneratingReport } = useSelector((state) => state.reports);
  const { patients } = useSelector((state) => state.patients);
  const { doctors } = useSelector((state) => state.doctors);
  const { departments } = useSelector((state) => state.departments);
  const { user } = useSelector((state) => state.auth);

  const [message, setMessage] = useState('');
  const [selectedContext, setSelectedContext] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('patient_summary');
  const [reportTitle, setReportTitle] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [aiChatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    dispatch(addChatMessage(userMessage));
    setMessage('');

    try {
      await dispatch(chatWithAI({
        message: userMessage.message,
        context: selectedContext
      })).unwrap();
    } catch (error) {
      toast.error('Failed to get AI response');
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      'patient_stats': 'Show me the current patient statistics and trends',
      'appointment_insights': 'Analyze appointment patterns and efficiency',
      'department_performance': 'Generate department performance insights',
      'resource_utilization': 'Analyze resource utilization across departments',
      'financial_summary': 'Create a financial summary report',
      'operational_metrics': 'Show operational metrics and KPIs'
    };

    setMessage(quickMessages[action]);
  };

  const handleGenerateReport = async () => {
    if (!reportTitle.trim()) {
      toast.error('Please enter a report title');
      return;
    }

    try {
      await dispatch(generateReport({
        reportType,
        title: reportTitle,
        parameters: selectedContext
      })).unwrap();
      toast.success('Report generated successfully!');
      setShowReportModal(false);
      setReportTitle('');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    { id: 'patient_stats', label: 'Patient Statistics', icon: '📊' },
    { id: 'appointment_insights', label: 'Appointment Insights', icon: '📅' },
    { id: 'department_performance', label: 'Department Performance', icon: '🏥' },
    { id: 'resource_utilization', label: 'Resource Utilization', icon: '⚡' },
    { id: 'financial_summary', label: 'Financial Summary', icon: '💰' },
    { id: 'operational_metrics', label: 'Operational Metrics', icon: '📈' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">
              Get intelligent insights and assistance for your hospital operations
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="btn-primary"
          >
            Generate Report
          </button>
          <button
            onClick={() => dispatch(clearChatHistory())}
            className="btn-secondary"
          >
            Clear Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="card h-96 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiChatHistory.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <span className="text-4xl mb-4 block">🤖</span>
                  <p className="text-lg font-medium">Welcome to your AI Assistant!</p>
                  <p className="text-sm">Ask me anything about your hospital operations, or use the quick actions below.</p>
                </div>
              ) : (
                aiChatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your hospital operations..."
                  className="flex-1 input-field"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Context Selection */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Context</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Patient</label>
                <select
                  value={selectedContext.patientId || ''}
                  onChange={(e) => setSelectedContext({
                    ...selectedContext,
                    patientId: e.target.value
                  })}
                  className="input-field"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Department</label>
                <select
                  value={selectedContext.departmentId || ''}
                  onChange={(e) => setSelectedContext({
                    ...selectedContext,
                    departmentId: e.target.value
                  })}
                  className="input-field"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Patient data analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Appointment optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Department insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Report generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Operational recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generate AI Report</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Report Title</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="input-field"
                    placeholder="Enter report title..."
                  />
                </div>

                <div>
                  <label className="label">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="input-field"
                  >
                    <option value="patient_summary">Patient Summary</option>
                    <option value="department_analytics">Department Analytics</option>
                    <option value="financial_report">Financial Report</option>
                    <option value="operational_report">Operational Report</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport || !reportTitle.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;