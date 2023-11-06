export default function Capitalize (text) {
    if(text)
    {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
