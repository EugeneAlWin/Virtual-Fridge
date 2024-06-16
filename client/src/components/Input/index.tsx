import {
	ChangeEventHandler,
	HTMLInputTypeAttribute,
	ReactNode,
	useState,
} from 'react'
import s from './input.module.scss'

export function Input(props: IInputProps) {
	const [isFocused, setIsFocused] = useState(false)
	return (
		<div className={s.container}>
			<p className={s.label}>{props.label}</p>
			<input
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				type={props.type}
				placeholder={props.placeholder}
				maxLength={props.maxLength}
				value={props.value ?? ''}
				onChange={props.onChange}
				className={`${s.input} ${isFocused && s.activeInput} ${props.hasError && s.errorInput}`}
				min={0}
			/>
			<div className={s.errorText}>
				{props.hasError ? props.errorText : ''}
			</div>
		</div>
	)
}

interface IInputProps {
	value: string | number | null
	label: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
	hasError?: boolean
	errorText?: string | ReactNode
	type?: HTMLInputTypeAttribute
	placeholder: string
	maxLength?: number
}
