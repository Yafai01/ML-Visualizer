# 🌌 Yafai Labs — Machine Learning Visualizer  
Interactive ML Playground built with React, Vite, and modern UI animations.

A complete collection of ML algorithm visualizers including:
- Linear Regression  
- K-Means Clustering  
- Neural Network Forward Pass  
- Decision Tree Splits  
- Logistic Regression  
- SVM Margins  
- PCA Dimensionality Reduction  

Designed with a dashboard layout, sidebar navigation, dark/light modes, and smooth Framer Motion animations.

---

## 🚀 Live Demo  
🔗 **https://ml-visualizer.vercel.app**  
(Replace with your actual deployed link after deployment.)

---

## 🧠 Features

### 🎨 Modern Dashboard UI
- Animated sidebar navigation  
- Theme toggle (light/dark)  
- Smooth fade transitions  
- Interactive cards & clean grid layout  

### 🤖 Machine Learning Modules
Each module includes interactive controls & real-time visuals:

| Algorithm | Features |
|----------|----------|
| **Linear Regression** | Adjustable dataset, live slope intercept update |
| **K-Means** | Auto-run, cluster steps, centroid animations |
| **Neural Network** | Forward-pass visualization with sigmoid activation |
| **Decision Tree** | Gini impurity & threshold splitting |
| **Logistic Regression** | Adjustable boundary & dataset separation |
| **SVM** | Margin visualization with support vectors |
| **PCA** | 2D → 1D projection with axis rotation |

### 🧭 Navigation
- Home (dashboard)  
- Each algorithm has its own page  
- Profile & settings page  

---

## 🛠 Tech Stack

### Frontend
- **React 18**
- **Vite**
- **React Router DOM**
- **Framer Motion**
- **Chart.js + react-chartjs-2**

### UI + Experience
- Custom CSS (no Tailwind)
- Page animations
- Sidebar transitions
- Slider + card styles
- Dark/Light theme context

---

## 📁 Project Structure

src/
components/
Sidebar.jsx
PageWrapper.jsx
LinearRegression.jsx
KMeans.jsx
NeuralNetwork.jsx
DecisionTree.jsx
LogisticRegression.jsx
SVM.jsx
PCA.jsx

pages/
Home.jsx
LinearPage.jsx
KMeansPage.jsx
NeuralPage.jsx
TreePage.jsx
LogisticPage.jsx
SVMPage.jsx
PCAPage.jsx
ProfilePage.jsx

context/
ThemeContext.jsx

App.jsx
main.jsx
index.css

yaml
Copy code

---

## ⚙️ Running Locally

```bash
git clone https://github.com/Yafai01/ML-Visualizer.git
cd ML-Visualizer
npm install
npm run dev
📦 Build for Production
bash
Copy code
npm run build
Build output goes into /dist.

🌍 Deploy to Web (Free)
Recommended: Vercel
Connect GitHub repo

Import project

Build command: npm run build

Output: dist

Deploys globally with HTTPS.

🧑‍💻 Author
Yafai (AIML Student)
💡 “I don’t give up — I level up.”

This project is part of my journey into full-stack machine learning visualization and web development.

