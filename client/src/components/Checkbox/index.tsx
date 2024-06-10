import { ChangeEventHandler, useState } from 'react'
import s from './checkbox.module.scss'

interface ICheckboxProps {
	value: boolean
	label: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
}

export function Checkbox(props: ICheckboxProps) {
	const [isFocused, setIsFocused] = useState(false)
	const [isSelected, setIsSelected] = useState(props.value)
	return (
		<div className={s.container}>
			<p className={s.label}>{props.label}</p>
			<button
				onClick={() => setIsSelected(prev => !prev)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				className={`${s.input} ${isFocused && s.inputActive}`}>
				{isSelected && <div className={s.activeBlock} />}
			</button>
		</div>
	)
}
