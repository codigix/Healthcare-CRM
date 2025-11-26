# Chatbot Workflow Testing Guide

## Step 1: Open Browser Developer Tools
- Press **F12** to open Developer Console
- Go to **Console** tab

## Step 2: Test Patient Search Directly
Run this in the console:

```javascript
// Test the API call
const token = localStorage.getItem('token');
console.log('Token:', token);

// Call the search API
fetch('http://localhost:5000/api/patients/search?name=sejal', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Response status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Patient search response:', data);
  console.log('Has patients array?', !!data.patients);
  console.log('Patients length:', data.patients?.length);
})
.catch(err => console.error('Error:', err));
```

## Step 3: Test Doctor Search
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/doctors/search?search=sanika', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Response status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Doctor search response:', data);
  console.log('Has doctors array?', !!data.doctors);
  console.log('Doctors length:', data.doctors?.length);
})
.catch(err => console.error('Error:', err));
```

## Step 4: Check Workflow Logs
After using the chatbot:
1. Open the **Console** tab in DevTools
2. Look for logs starting with `[WORKFLOW]`
3. Check for errors
4. Share the logs with the issue

## Expected Console Output
For patient "sejal":
```
[WORKFLOW] Searching for patient: sejal
[WORKFLOW] Patient search response: {success: true, patients: Array(1)}
[WORKFLOW] Response keys: ['success', 'patients']
[WORKFLOW] Patient found: {id: "...", name: "sejal  kale", ...}
```

For doctor "sanika":
```
[WORKFLOW] Searching for doctor: sanika
[WORKFLOW] Doctor search response: {success: true, doctors: Array(1)}
[WORKFLOW] Doctor response keys: ['success', 'doctors']
[WORKFLOW] Doctor found: {id: "...", name: "sanika mote", ...}
```
