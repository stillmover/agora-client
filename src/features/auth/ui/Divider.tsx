interface Props {
  text: string;
}

export default function Divider({ text }: Props) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="flex-1 h-px bg-gray-700" />
      <span className="text-gray-400 text-sm">{text}</span>
      <div className="flex-1 h-px bg-gray-700" />
    </div>
  );
}
