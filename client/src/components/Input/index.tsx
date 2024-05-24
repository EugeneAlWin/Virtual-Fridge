import styles from '@client/src/components/Input/input.module.scss'
import { ChangeEventHandler, InputHTMLAttributes } from 'react'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
	value: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
	id?: string
	hasError: boolean
	errorText: string
}

export function Input(props: IInputProps) {
	return (
		<>
			<input
				id={props.id}
				type={props.type}
				placeholder={props.placeholder}
				maxLength={props.maxLength}
				value={props.value}
				onChange={props.onChange}
				className={props.className}
			/>
			{props.hasError && (
				<span className={styles.errorText}>{props.errorText}</span>
			)}
		</>
	)
}
