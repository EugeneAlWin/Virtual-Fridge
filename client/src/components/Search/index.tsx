import { ChangeEventHandler, ReactNode } from 'react'
import styles from './search.module.scss'

interface ISearchInputProps {
	search: string
	onChange: ChangeEventHandler<HTMLInputElement> | undefined
	children?: ReactNode
	label: string
}

export function Search({
	label,
	search,
	onChange,
	children,
}: ISearchInputProps) {
	return (
		<div className={styles.container}>
			<div>
				<p className={styles.text}>{label}</p>
				<input
					className={styles.input}
					type='text'
					value={search}
					onChange={onChange}
				/>
			</div>
			<div>{children}</div>
		</div>
	)
}
