import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { TootData } from '../state'
import Poll from './Poll'
import styles from './Toot.module.css'

type TootProps = {
    toot: TootData
    canVote: boolean
}

const Toot = ({ toot, canVote }: TootProps) => {
    const [img, setImg] = useState<string | undefined>()
    const hasImage = toot.image != undefined
    useEffect(() => {
        const what = async () => {
            if (!toot.image) return
            const canvas = new OffscreenCanvas(toot.image.width, toot.image.height)

            toot.image.draw(canvas.getContext('2d')!)

            const blob = await canvas.convertToBlob()
            const url = URL.createObjectURL(blob)
            setImg(url)
        }

        void what()
    }, [toot.image])

    return (
        <div className={styles.toot}>
            <span>{toot.content}</span>
            {hasImage && (
                <div className={styles.toot_image_container}>
                    <img src={img} />
                </div>
            )}

            {toot.pollResults && <Poll results={toot.pollResults} canVote={canVote} />}
        </div>
    )
}

export default observer(Toot)
