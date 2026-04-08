import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ModeProvider } from '@/contexts/ModeContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { HomePage } from '@/pages/HomePage';
import { AssessmentPage } from '@/pages/AssessmentPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ModeProvider>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/assessment/:projectId" element={<AssessmentPage />} />
            </Routes>
          </ProjectProvider>
        </ModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;