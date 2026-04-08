import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ModeProvider } from '@/contexts/ModeContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { HomePage } from '@/pages/HomePage';

function App() {
  return (
    <ThemeProvider>
      <ModeProvider>
        <ProjectProvider>
          <HomePage />
        </ProjectProvider>
      </ModeProvider>
    </ThemeProvider>
  );
}

export default App;