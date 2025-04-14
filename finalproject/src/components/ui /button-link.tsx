'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

type ButtonLinkProps = ButtonProps & React.ComponentProps<typeof Link> & {
  // Additional props can be added here
};

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, href, variant, size, children, ...props }, ref) => {
    return (
      <Button
        asChild
        className={cn(className)}
        variant={variant}
        size={size}
        {...props}
      >
        <Link ref={ref} href={href} className="inline-flex items-center">
          {children}
        </Link>
      </Button>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';

export { ButtonLink };