package org.sollabs.messenger.jpa.extend;

import com.querydsl.core.types.dsl.BooleanExpression;

public final class PredicateBuilder<T> {
	
    private EntityPredicate<T> entityPredicate;
    private BooleanExpression result;

    public PredicateBuilder(Class<T> clazz, SearchCriteria criteria) {
        this.entityPredicate = new EntityPredicate<T>(clazz);
        result = new EntityPredicate<T>(clazz).getPredicate(criteria);
    }

    public PredicateBuilder<T> and(SearchCriteria criteria) {
    	result = result.and(entityPredicate.getPredicate(criteria));
		return this;
	}
	
	public PredicateBuilder<T> or(SearchCriteria criteria) {
		result = result.or(entityPredicate.getPredicate(criteria));
		return this;
	}

    public BooleanExpression getPredicate() {
        return result;
    }
}