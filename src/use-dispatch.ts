import { useContext } from 'react';
import { Reducers, State } from '../default';
import Context from './context';
import defaultGlobalStateManager from './default-global-state-manager';
import GlobalStateManager from './global-state-manager';
import Reducer, { Dispatcher, ExtractArguments } from './typings/reducer';
import REACT_HOOKS_ERROR from './utils/react-hooks-error';



export type UseDispatch<
  G extends {} = State,
  R extends {} = Reducers,
  K extends keyof R = keyof R,
  A extends any[] = any[]
> = Dispatcher<G, A> | Dispatcher<G, ExtractArguments<R[K]>>;



// useDispatch(Function)
export default function useDispatch<
  G extends {} = State,
  R extends {} = Reducers,
  A extends any[] = any[],
>(
  overrideGlobalStateManager: GlobalStateManager<G, any> | null,
  reducer: Reducer<G, R, A>,
): Dispatcher<G, A>;

// useDispatch('name')
export default function useDispatch<
  G extends {} = State,
  R extends {} = Reducers,
  K extends keyof R = keyof R,
>(
  overrideGlobalStateManager: GlobalStateManager<G, R> | null,
  reducer: K,
): Dispatcher<G, ExtractArguments<R[K]>>;

// Implementation
export default function useDispatch<
  G extends {} = State,
  R extends {} = Reducers,
  K extends keyof R = keyof R,
  A extends any[] = any[],
>(
  overrideGlobalStateManager: GlobalStateManager<G, R> | null,
  reducer: K | Reducer<G, R, A>,
): UseDispatch<G, R, K, A> {

  // Require hooks.
  if (!useContext) {
    throw REACT_HOOKS_ERROR;
  }

  // Get the global state manager.
  const globalStateManager: GlobalStateManager<G, R> =
    overrideGlobalStateManager ||
    (useContext(Context) as GlobalStateManager<G, R>) ||
    (defaultGlobalStateManager as GlobalStateManager<G, R>);

  // Use a custom reducer.
  if (typeof reducer === 'function') {
    return globalStateManager.createDispatcher(reducer);
  }

  // Use a pre-defined reducer.
  return globalStateManager.getDispatcher(reducer);
};
