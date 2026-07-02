/**
 * Access the local key/value storage API. Re-exported here for the
 * conventional hooks/ location.
 *
 * @example
 * const local = useLocal();
 * local.setItem('whoami', { name: 'Ada', emoji: '🦄' });
 */
export { useLocal } from '@/contexts/localContext';
