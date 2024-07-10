import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable, useRecoilValue } from 'recoil';
import { expoList, categories as categoriesState, themes as themesState, audienceTypes as audienceTypesState, locationTypes as locationTypesState } from '../../expos/recoil/items';
import { Category, Theme, AudienceType, LocationType } from '../../expos/recoil/items';
import Dropdown from '../Dropdown/Dropdown';
import styles from './Expo.module.css';

export default function Expo(): React.ReactElement {
  const location = useLocation();
  const [currLocation, setCurrLocation] = useState('');
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [selectedAudienceType, setSelectedAudienceType] = useState<number | null>(null);
  const [selectedLocationType, setSelectedLocationType] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const categories = useRecoilValue(categoriesState);
  const themes = useRecoilValue(themesState);
  const audienceTypes = useRecoilValue(audienceTypesState);
  const locationTypes = useRecoilValue(locationTypesState);

  const priceOptions = [
    { id: 0, name: 'Free Admission' },
    { id: 1, name: 'Paid Admission' }
  ];

  useEffect(() => {
    setCurrLocation(location.pathname.slice(1));
  }, [location]);

  const itemsLoadable = useRecoilValueLoadable(expoList);

  useEffect(() => {
    if (itemsLoadable.state === 'hasValue') {
      console.log('Exhibitions:', itemsLoadable.contents);
    } else if (itemsLoadable.state === 'hasError') {
      console.error('Error loading exhibitions:', itemsLoadable.contents);
    }
  }, [itemsLoadable]);

  const items = itemsLoadable.state === 'hasValue' ? itemsLoadable.contents : [];

  const filterItems = () => {
    return items.filter(item => {
      const categoryMatch = selectedCategory ? item.category_id === selectedCategory : true;
      const themeMatch = selectedTheme ? item.theme_id === selectedTheme : true;
      const audienceTypeMatch = selectedAudienceType ? item.audience_type_id === selectedAudienceType : true;
      const locationTypeMatch = selectedLocationType ? item.location_type_id === selectedLocationType : true;
      const priceMatch = selectedPrice === 0 ? item.price === 0 : selectedPrice === 1 ? item.price > 0 : true;
      return categoryMatch && themeMatch && audienceTypeMatch && locationTypeMatch && priceMatch;
    });
  };

  const handleToggleDropdown = (dropdownName: string) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.filtersContainer}>
          <Dropdown
            options={categories.map((category: Category) => ({ id: category.category_id, name: category.name }))}
            selectedValue={selectedCategory}
            onSelect={setSelectedCategory}
            placeholder="Categories"
            isOpen={openDropdown === 'category'}
            onToggle={() => handleToggleDropdown('category')}
          />
          <Dropdown
            options={themes.map((theme: Theme) => ({ id: theme.theme_id, name: theme.name }))}
            selectedValue={selectedTheme}
            onSelect={setSelectedTheme}
            placeholder="Themes"
            isOpen={openDropdown === 'theme'}
            onToggle={() => handleToggleDropdown('theme')}
          />
          <Dropdown
            options={audienceTypes.map((audienceType: AudienceType) => ({ id: audienceType.audience_type_id, name: audienceType.name }))}
            selectedValue={selectedAudienceType}
            onSelect={setSelectedAudienceType}
            placeholder="Audience"
            isOpen={openDropdown === 'audienceType'}
            onToggle={() => handleToggleDropdown('audienceType')}
          />
          <Dropdown
            options={locationTypes.map((locationType: LocationType) => ({ id: locationType.location_type_id, name: locationType.name }))}
            selectedValue={selectedLocationType}
            onSelect={setSelectedLocationType}
            placeholder="Location"
            isOpen={openDropdown === 'locationType'}
            onToggle={() => handleToggleDropdown('locationType')}
          />
          <Dropdown
            options={priceOptions}
            selectedValue={selectedPrice}
            onSelect={setSelectedPrice}
            placeholder="Price"
            isOpen={openDropdown === 'price'}
            onToggle={() => handleToggleDropdown('price')}
          />
        </div>
        <div className={styles.itemsContainer}>
          <div className={styles.itemWrapper}>
            {filterItems().length > 0
              ? filterItems().map((item) => (
                  <div
                    key={item.exhibition_id}
                    className={styles.itemBox}
                    onClick={() => {
                      navigate(`/expo/${item.exhibition_id}`);
                    }}
                  >
                    <figure className={styles.imgBox}>
                      <img className={styles.itemImg} alt={item.name} src={item.image_url} />
                    </figure>
                    <div className={styles.des}>
                      <p className={styles.itemName}>{item.name}</p>
                      <br></br>
                      <p className={styles.itemLocation}>{item.location}</p>
                      <p className={styles.itemDate}>{item.start_date} ~ {item.end_date}</p>
                      <button className={styles.ctaButton} onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expo/${item.exhibition_id}`);
                      }}>Explore</button>
                    </div>
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className={styles.itemBox}>
                    <figure className={styles.imgBox}></figure>
                    <div className={styles.des}></div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
