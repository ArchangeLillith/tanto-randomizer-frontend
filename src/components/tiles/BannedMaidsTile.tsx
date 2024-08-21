import { useContext, useEffect, useRef } from "react";
import TileBox from "../building-blocks/TileBox";
import Title from "../building-blocks/Title";
import { Card, ESet, setDisplayNames, setMapping } from "../../utils/types";
import { StateContext } from "../../utils/stateHandler";

const BannedMaidsTile = () => {
	const { state, dispatch } = useContext(StateContext);
	const allMaids = useRef<Card[]>([]);
	const previousSelection = useRef<string[]>([]);
	useEffect(() => {
		allMaids.current = state.setList.reduce(
			//accumulator is the place everything is added and persists between iterations, setName is the set that's currently being looked at
			(accumulator: Card[], setName: ESet) => {
				//setMapping[setName] calls to get the cards from the database, it's a bit weird due to the mapping caused by some typing issues and it makes it so we can do it in one call like this instead of looping through a bunch of ifs
				//If there are no cards for the set chosen, this returns nothing which should never happen but it's good to have extra error handling just in case
				//When the cards are grabbed, they're concatted with the potentially already populated accumulator as to not override.
				return accumulator.concat(setMapping[setName] || []);
			},
			[]
		);
	}, [state.setList]);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedMaids = Array.from(
			event.target.selectedOptions,
			(option) => option.value
		);
		//Maids that were just selected
		const newlySelected = selectedMaids.filter(
			(maid) => !previousSelection.current.includes(maid)
		);
		//Find the ones that were just deselected
		const newlyDeselected = previousSelection.current.filter(
			(maid) => !selectedMaids.includes(maid)
		);

		//Update the previous selection to the current one, as this will be the "previous" selection the next time this funtion runs
		previousSelection.current = selectedMaids;

		newlyDeselected.forEach((maid) => {
			dispatch({
				type: "BAN_MAIDS",
				payload: maid,
			});
		});

		newlySelected.forEach((maid) => {
			dispatch({
				type: "BAN_MAIDS",
				payload: maid,
			});
		});
	};
	return (
		<>
			{allMaids.current.length === 0 ? (
				<></>
			) : (
				<TileBox>
					<Title title="Banned Maids" />
					<div className="banned-maids-tile">
						<p>Would you like to ban any of the maids?</p>

						<select multiple={true} onChange={handleChange}>
							{allMaids.current.map((card: Card) => (
								<option id={card.name} value={card.name} key={card.name}>
									{setDisplayNames[card.set]} - {card.name}, {card.cardTitle}
								</option>
							))}
						</select>
					</div>
				</TileBox>
			)}
		</>
	);
};

export default BannedMaidsTile;
