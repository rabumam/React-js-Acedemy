'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ className, ratio = 16 / 9, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    ratio={ratio}
    className={cn('relative w-full h-full', className)}
    {...props}
  />
));
AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };