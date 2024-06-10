import cancelIcon from '@client/assets/cancel.svg'
import searchIcon from '@client/assets/search.svg'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import s from './search.module.scss'

export function Search({ search, onChange }: ISearchInputProps) {
	const [isInputInFocus, setIsInputInFocus] = useState(false)
	return (
		<div className={`${s.container} ${isInputInFocus && s.activeContainer}`}>
			<img src={searchIcon} alt={''} width={26} />
			<input
				onFocus={() => setIsInputInFocus(true)}
				onBlur={() => setIsInputInFocus(false)}
				className={s.input}
				type='text'
				onChange={e => onChange(e.target.value)}
				value={search}
			/>
			{search ? (
				<button className={s.cancelButton} onClick={() => onChange('')}>
					<img src={cancelIcon} alt={'cancel'} width={24} />
				</button>
			) : (
				<div style={{ width: 26 }} />
			)}
		</div>
	)
}

interface ISearchInputProps {
	search: string
	onChange: Dispatch<SetStateAction<string>>
	children?: ReactNode
}
