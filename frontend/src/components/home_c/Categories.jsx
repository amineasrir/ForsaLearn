import  python from'../../assets/image/cours/python.png'
import  js from'../../assets/image/cours/js.png'
import  php from'../../assets/image/cours/php.png'
import  laravel from'../../assets/image/cours/laravel.png'

const Categories = () => {
  return (
    <section className="categories" >
      <h1 style={{align:'center'}}>Choose Favourite Course From Top Category</h1>

      <div className="category-grid">
        <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={python} alt="Python Icon" />
          <h4>Python Development</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={js} alt="Python Icon" />
          <h4>js Development</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={php} alt="Python Icon" />
          <h4>Php Development</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={laravel} alt="Python Icon" />
          <h4>laravel Development</h4>

          </div>
       
      </div>
    </section>
  );
};

export default Categories;
