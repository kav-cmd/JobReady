#!/usr/bin/env node

/**
 * AI Tutor API Test Script
 * Test the AI Tutor endpoints
 * 
 * Usage: node test-ai-tutor.js
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper function to make API calls
 */
async function makeRequest(endpoint, body) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ Error: ${response.status}`);
      console.error(JSON.stringify(data, null, 2));
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return null;
  }
}

/**
 * Test Quiz Generation
 */
async function testQuiz() {
  console.log('\n📝 Testing Quiz Generation...');
  console.log('━'.repeat(50));
  
  const response = await makeRequest('/ai/quiz', {
    courseName: 'Data Entry Specialist',
    topic: 'Keyboard Shortcuts'
  });

  if (response && response.success) {
    console.log('✅ Quiz generated successfully');
    console.log(`Mode: ${response.mode}`);
    console.log(`Course: ${response.metadata.courseName}`);
    console.log(`Topic: ${response.metadata.topic}`);
    
    if (Array.isArray(response.content)) {
      console.log(`Number of questions: ${response.content.length}`);
      if (response.content[0]) {
        console.log(`\nFirst question: ${response.content[0].question}`);
      }
    } else {
      console.log('Content:', response.content.substring(0, 200));
    }
  }
}

/**
 * Test Notes Generation
 */
async function testNotes() {
  console.log('\n📚 Testing Notes Generation...');
  console.log('━'.repeat(50));
  
  const response = await makeRequest('/ai/notes', {
    courseName: 'Customer Service',
    topic: 'Handling Difficult Customers'
  });

  if (response && response.success) {
    console.log('✅ Notes generated successfully');
    console.log(`Mode: ${response.mode}`);
    console.log(`Course: ${response.metadata.courseName}`);
    console.log(`Topic: ${response.metadata.topic}`);
    console.log('\nContent Preview:');
    console.log(response.content.substring(0, 300) + '...');
  }
}

/**
 * Test Doubt Resolution
 */
async function testDoubt() {
  console.log('\n💡 Testing Doubt Resolution...');
  console.log('━'.repeat(50));
  
  const response = await makeRequest('/ai/doubt', {
    courseName: 'Data Entry Specialist',
    topic: 'Keyboard Shortcuts',
    userQuery: 'How can I use keyboard shortcuts to increase typing speed?'
  });

  if (response && response.success) {
    console.log('✅ Doubt resolved successfully');
    console.log(`Mode: ${response.mode}`);
    console.log(`Course: ${response.metadata.courseName}`);
    console.log(`Topic: ${response.metadata.topic}`);
    console.log('\nResponse Preview:');
    console.log(response.content.substring(0, 300) + '...');
  }
}

/**
 * Test Unified AI Tutor Endpoint
 */
async function testUnifiedEndpoint() {
  console.log('\n🤖 Testing Unified AI Tutor Endpoint...');
  console.log('━'.repeat(50));
  
  const response = await makeRequest('/ai/tutor', {
    courseName: 'Office Assistant',
    topic: 'Email Communication',
    mode: 'quiz'
  });

  if (response && response.success) {
    console.log('✅ Unified endpoint working');
    console.log(`Mode: ${response.mode}`);
    console.log(`Number of questions: ${Array.isArray(response.content) ? response.content.length : 'N/A'}`);
  }
}

/**
 * Test Health Check
 */
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  console.log('━'.repeat(50));
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/health`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ AI Service is operational');
      console.log(`Service: ${data.service}`);
      console.log(`Status: ${data.message}`);
    } else {
      console.log('❌ AI Service is not available');
    }
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║         AI TUTOR API TEST SUITE                    ║');
  console.log('╚════════════════════════════════════════════════════╝');

  await testHealthCheck();
  await testUnifiedEndpoint();
  await testQuiz();
  await testNotes();
  await testDoubt();

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║              TESTS COMPLETED                       ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
