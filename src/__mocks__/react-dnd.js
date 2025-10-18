// Mock react-dnd components
export const DndProvider = ({ children }) => children;

export const useDrag = () => [
  {
    isDragging: false,
  },
  jest.fn(),
];

export const useDrop = () => [
  {
    isOver: false,
  },
  jest.fn(),
];
