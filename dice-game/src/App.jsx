import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Game from "./Game";
import { TouchBackend } from 'react-dnd-touch-backend';

function App() {
  const isTouchDevice = 'ontouchstart' in document.documentElement
  return (
    <>
 <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
  <Game />
</DndProvider>
    </>
  );
}

export default App;
