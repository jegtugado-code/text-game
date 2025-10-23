import { useEffect } from 'react';

export type LetterKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
export type NumericKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';
export type SpecialKey =
  | 'Enter'
  | 'Escape'
  | ' '
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Shift'
  | 'Control'
  | 'Alt'
  | 'Tab'
  | 'Backspace';

export interface UseKeyPressProps {
  key: LetterKey | NumericKey | SpecialKey;
  onPress: () => void;
}

export const useKeyPress = ({ key, onPress }: UseKeyPressProps) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (key && event.key === key) {
        onPress();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, onPress]);
};
