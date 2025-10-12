import { Game } from './pages/game/Game';

function App() {
  return (
    // DaisyUI reads theme from `data-theme` on html or an ancestor element
    <div data-theme="coffee" className="min-h-screen bg-primary-content p-16">
      <Game />
    </div>
  );
}

export default App;
