import { useEffect, useState } from 'react';

import { HTMLChakraProps, Icon } from '@chakra-ui/react';

export const GoFoodIcon = (props: HTMLChakraProps<'svg'>) => {
  const [patternId, setPatternId] = useState('gofood_pattern1');

  useEffect(() => {
    setPatternId(Math.random().toString());
  }, []);

  return (
    <Icon viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        fill="#3E8989"
      />
      <rect x="3" y="3" width="18" height="18" fill={`url(#${patternId})`} />
      <defs>
        <pattern
          id={patternId}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_728_7116" transform="scale(0.005)" />
        </pattern>
        <image
          id="image0_728_7116"
          width="200"
          height="200"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </Icon>
  );
};
