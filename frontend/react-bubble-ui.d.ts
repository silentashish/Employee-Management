declare module 'react-bubble-ui' {
    import { ReactNode, CSSProperties } from 'react';
  
    interface BubbleUIProps {
      children: ReactNode;
      options: {
        size: number;
        minSize: number;
        gutter: number;
        provideProps: boolean;
        numCols: number;
        fringeWidth: number;
        yRadius: number;
        xRadius: number;
        cornerRadius: number;
        showGuides: boolean;
        compact: boolean;
        gravitation: number;
      };
      style?: CSSProperties;
    }
  
    const BubbleUI: React.FC<BubbleUIProps>;
    export default BubbleUI;
  }