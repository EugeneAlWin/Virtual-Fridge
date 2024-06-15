import { Dispatch, SetStateAction } from 'react'
import s from './photoInput.module.scss'

export default function PhotoInput({ image, setImage }: IPhotoInputProps) {
	return (
		<div className={s.container}>
			<input
				type={'file'}
				accept={'.jpg'}
				onChange={async e => {
					setImage(e.target.files?.[0])
				}}
			/>
			{!!image && (
				<img src={URL.createObjectURL(image)} alt={''} width={350} />
			)}
		</div>
	)
}

interface IPhotoInputProps {
	image?: File
	setImage: Dispatch<SetStateAction<File | undefined>>
}
