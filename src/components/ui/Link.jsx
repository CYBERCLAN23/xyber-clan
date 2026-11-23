import { forwardRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCMS } from '../../context/CMSContext';

const isExternal = (to) => /^(https?:|mailto:|tel:|\/\/)/.test(to || '');

/** Mark the next view transition as a page change (CSS picks the animation from this). */
export const markPageTransition = () => {
  document.documentElement.dataset.vt = 'page';
};

/**
 * Site link. Internal routes animate with a View Transition; external links
 * open safely in a new tab; hash links on the current page scroll smoothly.
 */
const Link = forwardRef(function Link({ to, href, children, newTab, onClick, ...rest }, ref) {
  const target = to ?? href ?? '#';
  const { isEditing } = useCMS();

  if (isExternal(target)) {
    const blank = newTab ?? /^https?:/.test(target);
    return (
      <a ref={ref} href={target} target={blank ? '_blank' : undefined} rel={blank ? 'noopener noreferrer' : undefined} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      ref={ref}
      to={target}
      viewTransition={!isEditing}
      onClick={(e) => {
        markPageTransition();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </RouterLink>
  );
});

export default Link;

/** navigate() with the page transition. */
export function useGo() {
  const navigate = useNavigate();
  return (to, opts = {}) => {
    markPageTransition();
    navigate(to, { viewTransition: true, ...opts });
  };
}
