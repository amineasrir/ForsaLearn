import  python from'../../assets/image/cours/python.png'
import  js from'../../assets/image/cours/js.png'
import  php from'../../assets/image/cours/php.png'
import  laravel from'../../assets/image/cours/laravel.png'

import { useTranslation } from 'react-i18next';

const Categories = () => {
  const { t } = useTranslation();
  return (
    <section className="categories" >
      <h1 style={{align:'center'}}>{t('homePage.categories.title')}</h1>

      <div className="category-grid">
        <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={python} alt="Python Icon" />
          <h4>{t('homePage.categories.cat1')}</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={js} alt="JS Icon" />
          <h4>{t('homePage.categories.cat2')}</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={php} alt="PHP Icon" />
          <h4>{t('homePage.categories.cat3')}</h4>
          </div>
           <div className="category-card" style={{display: 'flex', alignItems: 'center',justifyContent: 'center',flexDirection:'column',gap:'15px'}}>
          <img  style={{ width: '40px', height: '40px' }} src={laravel} alt="Laravel Icon" />
          <h4>{t('homePage.categories.cat4')}</h4>

          </div>
       
      </div>
    </section>
  );
};

export default Categories;
