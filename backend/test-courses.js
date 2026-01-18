/**
 * Course Module - Test Script
 * 
 * Test all course APIs with sample data
 * Run: node test-courses.js
 */

const API_BASE_URL = "http://localhost:5000/api";

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    console.error("API Error:", error.message);
    return { status: 0, error: error.message };
  }
}

// Sample course data
const sampleCourses = [
  {
    title: "Advanced Excel for Data Entry",
    category: "Computer Skills",
    description: "Learn advanced Excel functions and features for efficient data entry and analysis. This comprehensive course covers formulas, pivot tables, and data visualization.",
    youtubeLinks: [
      {
        title: "Excel Basics",
        url: "https://www.youtube.com/watch?v=example1",
      },
      {
        title: "Pivot Tables Tutorial",
        url: "https://www.youtube.com/watch?v=example2",
      },
    ],
    instructor: "John Smith",
  },
  {
    title: "Professional Business English",
    category: "English Communication",
    description: "Master professional English communication skills for the workplace. Learn to write emails, give presentations, and conduct business meetings effectively.",
    youtubeLinks: [
      {
        title: "Business Writing",
        url: "https://www.youtube.com/watch?v=example3",
      },
      {
        title: "Presentation Skills",
        url: "https://www.youtube.com/watch?v=example4",
      },
    ],
    instructor: "Sarah Johnson",
  },
  {
    title: "Accounting Fundamentals",
    category: "Basic Math",
    description: "Learn basic accounting principles and calculations. Master essential math skills for accountants and cashiers including calculations, percentages, and financial formulas.",
    youtubeLinks: [
      {
        title: "Basic Math for Accountants",
        url: "https://www.youtube.com/watch?v=example5",
      },
      {
        title: "Financial Calculations",
        url: "https://www.youtube.com/watch?v=example6",
      },
    ],
    instructor: "Mike Davis",
  },
];

// Test function
async function runTests() {
  console.log("🚀 Starting Course Module Tests\n");
  console.log("================================\n");

  let courseIds = [];

  // Test 1: Create Courses
  console.log("📝 TEST 1: Creating Courses\n");
  for (const course of sampleCourses) {
    const { status, data, error } = await apiCall("POST", "/courses", course);
    if (status === 201) {
      console.log(`✅ Created: ${data.data.title}`);
      courseIds.push(data.data._id);
    } else {
      console.log(`❌ Failed: ${error || data.message}`);
    }
  }
  console.log("\n");

  // Test 2: Get All Courses
  console.log("📚 TEST 2: Fetching All Courses\n");
  const { status: status2, data: data2 } = await apiCall("GET", "/courses");
  if (status2 === 200) {
    console.log(`✅ Fetched ${data2.data.length} courses`);
    console.log(`📊 Total Courses: ${data2.pagination.totalCourses}`);
    console.log(`📄 Pagination: Page ${data2.pagination.currentPage} of ${data2.pagination.totalPages}`);
  } else {
    console.log(`❌ Failed: ${data2.message}`);
  }
  console.log("\n");

  // Test 3: Get Courses by Category
  console.log("🏷️ TEST 3: Fetching Courses by Category\n");
  const categories = ["Computer Skills", "English Communication", "Basic Math"];
  for (const category of categories) {
    const categoryParam = encodeURIComponent(category);
    const { status, data } = await apiCall("GET", `/courses/category/${categoryParam}`);
    if (status === 200) {
      console.log(`✅ ${category}: ${data.count} course(s) found`);
    } else {
      console.log(`❌ ${category}: ${data.message}`);
    }
  }
  console.log("\n");

  // Test 4: Get Course by ID
  if (courseIds.length > 0) {
    console.log("🔍 TEST 4: Fetching Course by ID\n");
    const { status, data } = await apiCall("GET", `/courses/${courseIds[0]}`);
    if (status === 200) {
      console.log(`✅ Fetched: ${data.data.title}`);
      console.log(`👁️ Views: ${data.data.viewCount}`);
    } else {
      console.log(`❌ Failed: ${data.message}`);
    }
    console.log("\n");
  }

  // Test 5: Pagination Test
  console.log("📖 TEST 5: Testing Pagination\n");
  const { status: status5, data: data5 } = await apiCall("GET", "/courses?limit=2&page=1");
  if (status5 === 200) {
    console.log(`✅ Paginated results: ${data5.data.length} courses (limit: 2)`);
    console.log(`📄 Page Info: ${data5.pagination.currentPage}/${data5.pagination.totalPages}`);
  } else {
    console.log(`❌ Failed: ${data5.message}`);
  }
  console.log("\n");

  // Test 6: Validation Test (Invalid Category)
  console.log("⚠️ TEST 6: Testing Validation (Invalid Category)\n");
  const { status: status6, data: data6 } = await apiCall("GET", "/courses/category/InvalidCategory");
  if (status6 === 400) {
    console.log(`✅ Correctly rejected invalid category`);
    console.log(`   Error: ${data6.message}`);
  } else {
    console.log(`❌ Should have rejected invalid category`);
  }
  console.log("\n");

  // Test 7: Duplicate Course Test
  console.log("🔄 TEST 7: Testing Duplicate Prevention\n");
  const { status: status7, data: data7 } = await apiCall("POST", "/courses", sampleCourses[0]);
  if (status7 === 409) {
    console.log(`✅ Correctly prevented duplicate course`);
    console.log(`   Message: ${data7.message}`);
  } else {
    console.log(`❌ Should have prevented duplicate`);
  }
  console.log("\n");

  // Test 8: Invalid YouTube URL Test
  console.log("🎥 TEST 8: Testing YouTube URL Validation\n");
  const invalidCourse = {
    ...sampleCourses[0],
    title: "Test Invalid URL Course",
    youtubeLinks: [
      {
        title: "Invalid Link",
        url: "https://notayoutubelink.com/video",
      },
    ],
  };
  const { status: status8, data: data8 } = await apiCall("POST", "/courses", invalidCourse);
  if (status8 === 400) {
    console.log(`✅ Correctly rejected invalid YouTube URL`);
    const errors = data8.errors || [];
    errors.forEach((err) => console.log(`   Error: ${err}`));
  } else {
    console.log(`❌ Should have rejected invalid URL`);
  }
  console.log("\n");

  // Test 9: Delete Course
  if (courseIds.length > 0) {
    console.log("🗑️ TEST 9: Deleting Course\n");
    const { status: status9, data: data9 } = await apiCall("DELETE", `/courses/${courseIds[0]}`);
    if (status9 === 200) {
      console.log(`✅ Course soft-deleted: ${data9.data.title}`);
      console.log(`   isActive: ${data9.data.isActive}`);
    } else {
      console.log(`❌ Failed: ${data9.message}`);
    }
    console.log("\n");
  }

  console.log("================================");
  console.log("✨ Tests Complete!\n");
}

// Run tests
runTests().catch(console.error);
