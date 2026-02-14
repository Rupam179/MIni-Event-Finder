# 🎯 Mini Event Finder

> **Author:** Rupam Mukherjee

A full-stack **event discovery web application** built using **Node.js + Express (backend)** and **React (frontend)**.  
Users can create, discover, and join events with real-time updates and smart filtering.

[![Status](https://img.shields.io/badge/Status-Live-success)](https://teal-pavlova-ed969d.netlify.app/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://teal-pavlova-ed969d.netlify.app/)

🌐 **Live Website:**  
👉 https://teal-pavlova-ed969d.netlify.app/

---

## 🌟 Features

### Core Functionality
- 🔍 Event Discovery – Browse available events
- 🧠 Smart Filtering – Filter by category, search text, and date
- ✍️ Event Creation – Create events with detailed info
- 🙋 Join / Leave Events – RSVP and manage attendance
- ⚡ Real-time Updates – Live attendee count updates
- 📱 Responsive Design – Works on desktop, tablet, and mobile

### Event Categories
- 🖥️ Technology
- 💪 Health & Fitness
- 🎨 Arts & Culture
- ⚽ Sports
- 👥 Social
- 💼 Business

### User Experience
- Modern gradient UI
- Smooth animations & transitions
- Interactive hover event cards
- Real-time notifications
- Capacity tracking (spots remaining)
- Status indicators (Full / Limited Spots)

---

## 🚀 Tech Stack

### Backend
- Node.js – Runtime environment
- Express.js – Web framework
- CORS – Cross-origin support

### Frontend
- React 18
- Tailwind CSS
- Modern JavaScript (ES6+)

### Architecture
- RESTful API
- Component-based frontend
- In-memory data storage (database ready)

---

## 📁 Project Structure
```

mini-event-finder/
├── server.js
├── index.html
├── package.json
└── README.md

````

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v14+
- npm or yarn

### Backend Setup
```bash
npm install
npm start
````

Development mode:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3001
```

---

### Frontend Setup

Open `index.html` directly OR run:

```bash
python -m http.server 8000
```

or

```bash
npx http-server -p 8000
```

Access:

```
http://localhost:8000
```

---

## 🔌 API Endpoints

### Events

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| GET    | /api/events     | Get all events   |
| GET    | /api/events/:id | Get single event |
| POST   | /api/events     | Create event     |
| DELETE | /api/events/:id | Delete event     |

Query params:

```
category, search, date
```

### Event Actions

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | /api/events/:id/join  | Join event  |
| POST   | /api/events/:id/leave | Leave event |

Example:

```json
{
  "userId": "user123"
}
```

---

## 📝 Usage Example

### Create Event

```json
POST /api/events
{
  "title": "Tech Meetup: AI & ML",
  "description": "Join us for discussions on AI",
  "date": "2026-03-15",
  "time": "18:00",
  "location": "Tech Hub",
  "category": "Technology",
  "maxAttendees": 50,
  "organizer": "John Doe"
}
```

### Filter Events

```
GET /api/events?category=Technology&search=AI
```

---

## 🔧 Customization

### Add New Category

```js
const categories = [
  'Technology','Health','Arts','Sports','Social','Business','YourCategory'
];
```

Color:

```js
const categoryColors = {
  YourCategory: 'bg-yellow-100 text-yellow-800'
};
```

---

## 🚧 Future Enhancements

* Authentication & profiles
* Comments & reviews
* Image uploads
* Calendar integration
* Email notifications
* Maps integration
* AI recommendations
* Recurring events
* Waitlist system

---

## 🐛 Known Issues

* Data resets on server restart
* No authentication
* No image upload
* Limited error handling

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Rupam Mukherjee**

GitHub: [https://github.com/Rupam179](https://github.com/Rupam179)
LinkedIn: [https://www.linkedin.com/in/rupam-mukherjee-647a092b0/](https://www.linkedin.com/in/rupam-mukherjee-647a092b0/)
Email: [mukherjeerupam14@gmail.com](mailto:mukherjeerupam14@gmail.com)

---

**Happy Event Finding! 🎉**

```
