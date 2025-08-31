import { ToggleButton, ToggleButtonGroup } from "@mui/material";
const options = ["😍","😄","😊","🙂","😐","😔","😢","😡"];

export function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  return (
    <ToggleButtonGroup value={value} exclusive onChange={(_, v) => v && onChange(v)} size="small">
      {options.map(e => (<ToggleButton key={e} value={e}>{e}</ToggleButton>))}
    </ToggleButtonGroup>
  );
}
