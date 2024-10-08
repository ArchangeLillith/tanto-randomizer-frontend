import { createContext, ReactNode, useReducer } from "react";
import {
	FilterState,
	EReminescenseOptions,
	EBeerOptions,
	ESlantOptions,
	EAttackOptions,
	ESet,
} from "./types";

const initialState: FilterState = {
	listView: false,
	setList: [],
	bannedCards: [],
	sisterInclusion: 0,
	attackOptions: EAttackOptions.NoPreference,
	beerOptions: EBeerOptions.NoPreference,
	reminescenseOptions: EReminescenseOptions.All,
	victoryPointSlant: ESlantOptions.NoSlant,
	cardDrawSlant: ESlantOptions.NoSlant,
	loveCostSlant: ESlantOptions.NoSlant,
	loveGiveSlant: ESlantOptions.NoSlant,
	servingsSlant: ESlantOptions.NoSlant,
	employEffectsSlant: ESlantOptions.NoSlant,
	booleans: {
		includePrivateMaids: true,
		includeEvents: true,
		includeBuildings: true,
		includeCouples: true,
	},
};


type Action =
	| { type: "TOGGLE_BOOLEAN"; payload: keyof FilterState["booleans"] }
	| { type: "HANDLE_SET_LIST"; payload: ESet }
	| { type: "SET_SISTER_INCLUSION"; payload: number }
	| {
			type: "SET_SLANT_OPTION";
			payload: { key: keyof FilterState; value: ESlantOptions };
	  }
	| {
			type: "TOGGLE_LIST_VIEW";
	  }
	| {
			type: "RESET_STATE";
	  }
	| {
			type: "SET_SELECTED_OPTION";
			payload: { key: keyof FilterState; value: string };
	  }
	| {
			type: "BAN_MAIDS";
			payload: string;
	  };

function reducer(state: FilterState, action: Action): FilterState {
	switch (action.type) {
		case "TOGGLE_BOOLEAN": {
			const booleanKey = action.payload;
			return {
				...state,
				booleans: {
					...state.booleans,
					[booleanKey]: !state.booleans[booleanKey], 
				},
			};
		}
		case "HANDLE_SET_LIST": {
			const set = action.payload;
			return {
				...state,
				setList: state.setList.includes(set)
					? state.setList.filter((item) => item !== set)
					: [...state.setList, set],
			};
		}
		case "SET_SELECTED_OPTION":
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};
		case "SET_SISTER_INCLUSION":
			return {
				...state,
				sisterInclusion: action.payload,
			};
		case "SET_SLANT_OPTION": {
			return {
				...state,
				[action.payload.key]: action.payload.value, 
			};
		}
		case "TOGGLE_LIST_VIEW": {
			return {
				...state,
				listView: !state.listView,
			};
		}
		case "RESET_STATE": {
			return initialState;
		}
		case "BAN_MAIDS": {
			const maidName = action.payload;
			const isBanned = state.bannedCards.includes(maidName);
			return {
				...state,
				bannedCards: isBanned
					? state.bannedCards.filter((name) => name !== maidName)
					: [...state.bannedCards, maidName],
			};
		}
		default:
			return state;
	}
}

export const StateContext = createContext<{
	state: FilterState;
	dispatch: React.Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => undefined,
});

interface StateProviderProps {
	children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<StateContext.Provider value={{ state, dispatch }}>
			{children}
		</StateContext.Provider>
	);
};
