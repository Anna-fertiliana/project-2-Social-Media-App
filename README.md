Social Media App 

A modern Instagram-like social media platform built with Next.js, Tailwind CSS, React Query, and REST API backend, deployed on Vercel.

This project demonstrates a fully functional social media experience including user profiles, follow system, posts feed, and profile interactions.

🔗 Live Demo:
https://project-2-git-main-anna-fertilianas-projects.vercel.app/

✨ Features
👤 User System
User authentication (JWT-based)
Profile page with avatar, bio, and username
Dynamic user profile routing (/users/[username])

📸 Posts System
Create and display image posts
Grid-based Instagram-style gallery
Post detail navigation
Like count preview on hover (desktop)

👥 Follow System
Follow / Unfollow users
Followers & Following pages
Real-time follow status indicator
Mutual follow indicator ("Follows you")

📊 Profile Features
Profile stats:
Posts count
Followers count
Following count
Clickable stats navigation:
/followers
/following
Edit profile page
Share profile feature

🧭 UI / UX Features

Responsive mobile-first design
Instagram-like layout
Tabs (Gallery / Liked / Saved)
Sticky header on detail pages
Skeleton loading states
Empty state handling

⚡ Performance & Tech

Next.js App Router
React Query for server state caching
Axios instance for API handling
Optimized image rendering
Component-based architecture

🧱 Tech Stack

Frontend

Next.js 14 (App Router)
React
Tailwind CSS
Lucide Icons

State & Data

React Query
Axios

Backend (API)

REST API (JWT Authentication)
User, Post, Follow endpoints

Deployment

Vercel
📂 Main Pages
/ → Feed (posts)
/users/[username] → User profile
/users/[username]/followers
/users/[username]/following
/me → My profile
/me/edit → Edit profile
/posts/[id] → Post detail
🧠 Key Highlights (Project Goals)

This project was built to practice:

Real-world social media architecture
Follow graph system (followers/following logic)
Profile-based routing in Next.js
API integration with React Query caching
Clean UI cloning of Instagram behavior
Scalable component structure

🚀 Future Improvements

Infinite scroll feed
Real-time notifications
Direct messaging system
Post comments system
Story feature (Instagram Stories clone)
Optimistic UI updates for follow system
Image upload compression

📸 Preview

Instagram-like UI with profile pages, post grid, and follow system.