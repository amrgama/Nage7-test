# installation

**Need to install `yarn`**

- install yarn global `npm install --global yarn`
- install packages `yarn`
- run project `yarn start`

> please don't use `strings.setLanguage(lang)` in every page we initial `lang` in the`app` page

## Change Logo

- Replace `logo.png` in `Assets/Images` with another new logo
- Convert **logo** to **favicon** [Logo Converter](https://favicon.io/favicon-converter/) and then add to `public` directory.

## Update Colors

- Open `theme.js` and add `primary`, `secondary` and `linear` color
- To get `linear gradient` from one **color** U can use this [colordesigner](https://colordesigner.io/gradient-generator)

## Axios Error Handler

> Example For Post (disable toastify on error)

```
const submitData = ()=>{
    axios.post("https://jsonplaceholder.typicode.com/todoss", { headers: {}, _opts: { noToast: true } }).then(res => {

        throw new Error("blabla")
        }).catch(err => {

    })
}
```

> Example For Get (enable toastify on GET requests)

```
useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/todoss", { headers: {}, _opts: { toastifyOnGet: true } }).then(res => {
      throw new Error("blabla")
    }).catch(err => {
    })
  }, [])
```
