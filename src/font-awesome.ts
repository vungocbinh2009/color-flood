import { library } from '@fortawesome/fontawesome-svg-core'
import { } from "@fortawesome/free-brands-svg-icons"
import { } from "@fortawesome/free-regular-svg-icons"
import { faBan, faHome, faX, faPlusCircle } from "@fortawesome/free-solid-svg-icons"

export let addAllIcons = () => {
    library.add(
        faBan, faHome, faX, faPlusCircle
    )
}