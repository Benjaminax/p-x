import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function LottieAnimation({ url, loop = true, autoplay = true, style = { width: 120, height: 120 } }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!url) return;
    fetch(url)
      .then((r) => r.json())
      .then((json) => { if (mounted) setData(json); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [url]);

  if (!data) return null;
  return (
    <div style={style} aria-hidden="true">
      <Lottie animationData={data} loop={loop} autoplay={autoplay} />
    </div>
  );
}

