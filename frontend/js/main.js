// API Base URL
const API_BASE_URL = 'https://slot-booking-project-tpe9.onrender.com/api';
// Format time slot for display
function formatTimeSlot(timeSlot) {
    const timeMap = {
        '09:00:00': '09:00 AM - 10:00 AM',
        '10:00:00': '10:00 AM - 11:00 AM',
        '11:00:00': '11:00 AM - 12:00 PM',
        '12:00:00': '12:00 PM - 01:00 PM',
        '14:00:00': '02:00 PM - 03:00 PM',
        '15:00:00': '03:00 PM - 04:00 PM',
        '16:00:00': '04:00 PM - 05:00 PM',
        '17:00:00': '05:00 PM - 06:00 PM'
    };
    return timeMap[timeSlot] || timeSlot;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Booking Form Handler
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message';
        messageDiv.textContent = 'Booking...';
        messageDiv.style.display = 'block';
        
        const formData = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            date: document.getElementById('date').value,
            time_slot: document.getElementById('time_slot').value
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/book-slot/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageDiv.className = 'message success';
                messageDiv.textContent = '✅ Slot booked successfully!';
                bookingForm.reset();
                
                // Set min date to tomorrow
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                document.getElementById('date').valueAsDate = tomorrow;
            } else {
                throw new Error(data.message || 'Booking failed');
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = '❌ Error: ' + error.message;
        }
    });
    
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('date').min = tomorrow.toISOString().split('T')[0];
    document.getElementById('date').valueAsDate = tomorrow;
}

// Booked Slots Page Handler
const slotsList = document.getElementById('slotsList');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const filterDate = document.getElementById('filterDate');
const refreshBtn = document.getElementById('refreshBtn');

// Fetch and display booked slots
async function fetchBookedSlots(dateFilter = '') {
    if (!slotsList) return;
    
    try {
        loading.style.display = 'block';
        slotsList.innerHTML = '';
        errorMessage.style.display = 'none';
        
        let url = `${API_BASE_URL}/booked-slots/`;
        if (dateFilter) {
            url += `?date=${dateFilter}`;
        }
        
        const response = await fetch(url);
        const slots = await response.json();
        
        loading.style.display = 'none';
        
        if (slots.length === 0) {
            slotsList.innerHTML = '<div class="empty-state">📭 No slots booked yet</div>';
            return;
        }
        
        displaySlots(slots);
    } catch (error) {
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to load slots. Please try again.';
        console.error('Error:', error);
    }
}

// Display slots in the grid
function displaySlots(slots) {
    slotsList.innerHTML = slots.map(slot => `
        <div class="slot-card">
            <h3>${slot.name}</h3>
            <p><strong>Username:</strong> @${slot.username}</p>
            <p><strong>Date:</strong> ${formatDate(slot.date)}</p>
            <span class="slot-time">⏰ ${formatTimeSlot(slot.time_slot)}</span>
        </div>
    `).join('');
}

// Event listeners for booked slots page
if (slotsList) {
    // Initial load
    fetchBookedSlots();
    
    // Filter by date
    if (filterDate) {
        filterDate.addEventListener('change', (e) => {
            fetchBookedSlots(e.target.value);
        });
    }
    
    // Refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchBookedSlots(filterDate ? filterDate.value : '');
        });
    }
}

// Auto-refresh booked slots every 30 seconds (optional)
if (slotsList && !filterDate?.value) {
    setInterval(() => {
        fetchBookedSlots(filterDate ? filterDate.value : '');
    }, 30000);
}
