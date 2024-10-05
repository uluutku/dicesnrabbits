import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Game from "./Game";

function App() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Game />
      </DndProvider>
    </>
  );
}

export default App;
