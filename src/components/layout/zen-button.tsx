import { Origami } from 'lucide-react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function ZenButton() {
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsZenMode(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!isZenMode) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    // className="md:flex hidden items-center space-x-2 text-slate-400"
    <div className={twMerge("md:flex hidden items-center space-x-2 text-slate-400", isZenMode ? "text-orange-500" : "")}>
      <Origami />
      <Label>Zen Mode</Label>
      <Switch  onClick={toggleFullscreen}/>
    </div>
  );
}
